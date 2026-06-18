import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { Form } from "react-aria-components/Form";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import layoutRoutes from "@/routes/cms/layouts";

interface SiteLayoutInfoFormDialogProps {
  initialValues: {
    id: number;
    key: string;
    name: string;
  };
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface SiteLayoutInfoFormValues {
  key: string;
  name: string;
}

export function SiteLayoutInfoFormDialog({
  initialValues,
  isOpen,
  onOpenChange,
}: SiteLayoutInfoFormDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <SiteLayoutInfoFormDialogContent
      initialValues={initialValues}
      onOpenChange={onOpenChange}
    />
  );
}

interface SiteLayoutInfoFormDialogContentProps {
  initialValues: {
    id: number;
    key: string;
    name: string;
  };
  onOpenChange: (isOpen: boolean) => void;
}

function SiteLayoutInfoFormDialogContent({
  initialValues,
  onOpenChange,
}: SiteLayoutInfoFormDialogContentProps) {
  const form = useForm<SiteLayoutInfoFormValues>({
    name: initialValues.name,
    key: initialValues.key,
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    form.patch(layoutRoutes.update.url({ siteLayout: initialValues.id }), {
      onSuccess: () => {
        onOpenChange(false);
      },
      preserveScroll: true,
    });
  }

  return (
    <ModalContent
      aria-label={`Chỉnh sửa thông tin ${initialValues.name}`}
      isOpen={true}
      onOpenChange={onOpenChange}
      size="lg"
    >
      <Form onSubmit={submit}>
        <ModalHeader>
          <ModalTitle>Chỉnh sửa thông tin</ModalTitle>
          <ModalDescription>
            Cập nhật tên hiển thị và key định danh của layout.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <FieldGroup className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layout-info-name">Tên layout</Label>
              <Input
                id="layout-info-name"
                value={form.data.name}
                onChange={(event) => form.setData("name", event.target.value)}
              />
              {form.errors.name ? (
                <FieldError>{form.errors.name}</FieldError>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout-info-key">Key</Label>
              <Input
                id="layout-info-key"
                value={form.data.key}
                onChange={(event) => form.setData("key", event.target.value)}
              />
              {form.errors.key ? (
                <FieldError>{form.errors.key}</FieldError>
              ) : null}
            </div>
          </FieldGroup>
        </ModalBody>
        <ModalFooter>
          <Button intent="outline" onPress={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button isDisabled={form.processing} type="submit">
            {form.processing ? "Đang lưu..." : "Lưu thông tin"}
          </Button>
        </ModalFooter>
      </Form>
    </ModalContent>
  );
}
