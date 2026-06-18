<?php

use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\Student;
use App\Models\StudentGroup;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('homepage resolves through site settings when configured', function () {
    $page = Page::factory()->create([
        'title' => 'Trang chủ VMUFit',
        'slug' => 'trang-chu-vmufit',
        'visibility' => 'public',
    ]);

    SiteSetting::set(SiteSetting::KEY_HOMEPAGE_PAGE, $page->getKey());

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('public/page')
            ->where('page.slug', 'trang-chu-vmufit')
        );
});

test('student group protected public page only opens for matching students', function () {
    $page = Page::factory()->create([
        'title' => 'Trang cho sinh viên nhóm riêng',
        'slug' => 'trang-cho-sinh-vien-nhom-rieng',
        'visibility' => 'student_groups',
    ]);

    $group = StudentGroup::factory()->global()->create([
        'code' => 'GROUP123',
    ]);
    $group->members()->createMany([
        ['student_code' => '94903'],
        ['student_code' => '123456'],
    ]);
    $page->studentGroups()->sync([$group->getKey()]);

    $guestResponse = $this->get('/trang-cho-sinh-vien-nhom-rieng');
    $guestResponse->assertRedirect(route('login'));

    $nonMatchingUser = User::factory()->create();
    Student::factory()->for($nonMatchingUser)->create([
        'student_code' => '777777',
    ]);

    $this->actingAs($nonMatchingUser)
        ->get('/trang-cho-sinh-vien-nhom-rieng')
        ->assertForbidden();

    $matchingUser = User::factory()->create();
    Student::factory()->for($matchingUser)->create([
        'student_code' => '94903',
    ]);

    $this->actingAs($matchingUser)
        ->get('/trang-cho-sinh-vien-nhom-rieng')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('public/page')
            ->where('page.slug', 'trang-cho-sinh-vien-nhom-rieng')
        );
});

test('hidden public page is only visible to cms users', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    $page = Page::factory()->create([
        'title' => 'Trang nội bộ quản trị',
        'slug' => 'trang-noi-bo-quan-tri',
        'visibility' => 'hidden',
    ]);

    $guestResponse = $this->get('/trang-noi-bo-quan-tri');
    $guestResponse->assertRedirect(route('login'));

    $regularUser = User::factory()->create();

    $this->actingAs($regularUser)
        ->get('/trang-noi-bo-quan-tri')
        ->assertForbidden();

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get('/trang-noi-bo-quan-tri')
        ->assertOk()
        ->assertInertia(fn (Assert $inertia) => $inertia
            ->component('public/page')
            ->where('page.slug', $page->slug)
        );
});
