import { ActionContainer, BaseDialog, BaseDialogProps, Divider } from '..'
import { Button } from '../../button'
import { Highlight, Title } from '../../title'

type EmployeeDialogProps = { title: string, src: string } & BaseDialogProps;

export function ImageViewDialog(props: EmployeeDialogProps) {
  const { title, ...rest } = props


  return (
    <BaseDialog
      {...rest}
      title={
        <Title>
          <Highlight>{title}</Highlight>
        </Title>
      }
      footer={
        <ActionContainer>
          <Divider />
          <Button onClick={() => props.onOpenChange(false)}>Закрыть</Button>
        </ActionContainer>
      }
    >
      <img
        src={props.src}
        style={{
          width: '100%',
          maxHeight: '80vh',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </BaseDialog>
  )
}
