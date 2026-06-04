<?php

use App\Models\Page;
use App\Models\SiteSetting;
use App\Models\Student;
use App\Models\StudentGroup;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('homepage resolves through site settings when configured', function () {
    $page = Page::factory()->create([
        'title' => 'Trang chủ VMUFit',
        'slug' => 'trang-chu-vmufit',
        'status' => 'published',
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
        'status' => 'published',
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
