export const ErrorComponent = (ErrorMessage) => `
function App()
{
  const err_msg = \`${ErrorMessage.replace(/`/g,"'")}\`
  return (
    <div style={{margin:"10px 10px 10px 10px"}}>
      <antd.Alert
      message="Error"
      description={err_msg}
      type="error"
      showIcon
    />
    </div>
  )
}
`;