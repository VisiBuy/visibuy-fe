import React from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
  disabled?: boolean;
}

export default function ToggleCheckbox({
    checked,
    onChange,
    label,
    description,
    disabled = false,
}:ToggleSwitchProps) {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  // Base classes for the switch body. Using standard Tailwind colors for clear implementation.
  const switchBodyClasses = 'relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out peer-focus:outline-none peer-checked:bg-[#000000] cursor-pointer bg-gray-300 peer-focus:ring-black';

  // Classes for the switch knob (implemented via the ::after pseudo-element).
  const knobClasses = `after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 after:bg-white after:shadow-md peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full`;

  return (
      <div className="border border-gray-500 p-2 rounded-lg">
        <div className='flex items-center justify-between'>
            <div
                className='flex flex-col'
                >
               <h4 className='text-gray-900 font-semibold text-[12px]'> {label}</h4>
               <p className='text-gray-500 text-[10px]'> {description}</p>
            </div>
            <div>
                <label className="inline-flex items-center gap-5" aria-disabled={disabled}>
                    <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only peer"
                    />

                    <div className={`${switchBodyClasses} ${knobClasses}`}>
                    </div>
                
                </label>
            </div>
        </div>
    </div>
  );
};

