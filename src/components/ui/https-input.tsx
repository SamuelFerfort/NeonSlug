import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./input-group";

export default function HttpsInput({
  className,
  ...props
}: React.ComponentProps<typeof InputGroupInput>) {
  const stripProtocol = (value: string) => {
    return value.replace(/^(https?:\/\/|ftp:\/\/)/i, "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = stripProtocol(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const input = e.currentTarget;
    
    // Insert stripped URL at cursor position
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const strippedValue = stripProtocol(pastedText);
    
    input.value = 
      input.value.substring(0, start) + 
      strippedValue + 
      input.value.substring(end);
    
    // Set cursor after pasted text
    const newCursorPos = start + strippedValue.length;
    input.setSelectionRange(newCursorPos, newCursorPos);
    
    // Trigger input event so form state updates
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <InputGroup className={className}>
      <InputGroupInput 
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="example.com"
        className="!pl-1"
        {...props} 
      />
      <InputGroupAddon>
        <InputGroupText className="text-gray-400">https://</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
