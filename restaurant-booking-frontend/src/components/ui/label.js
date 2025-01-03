export function Checkbox({ id }) {
  return <input type="checkbox" id={id} />;
}

// Define Label component (or import from your UI library if available)
export function Label({ htmlFor, children }) {
  return <label htmlFor={htmlFor}>{children}</label>;
}

// Define the LabelDemo component
export function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    </div>
  );
}

// Export LabelDemo as default
export default LabelDemo;
