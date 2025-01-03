const Checkbox = ({ checked, onChange, label }) => {
    return (
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span>{label}</span>
      </label>
    );
  };
  
  export default Checkbox;
  