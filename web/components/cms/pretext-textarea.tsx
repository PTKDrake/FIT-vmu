import { Textarea, type TextareaProps } from "@/components/ui/textarea";

export interface PretextTextareaProps extends TextareaProps {}

export function PretextTextarea(props: PretextTextareaProps) {
  return <Textarea autosize {...props} />;
}
