export default function Inputbox({ label, placeholder, value, onChange, width,type,name,min}) {
    return (
      <div className="mx-1">
      <div className="text-sm font-medium text-left py-2">
        <label className="mb-2">{label}</label></div>
        <input
          required
          min={min}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-${width} px-2 py-1 border rounded border-slate-200 bg-zinc-300 border-solid border-1 border-neutral-500`}
        />
      </div>
    );
  }
  