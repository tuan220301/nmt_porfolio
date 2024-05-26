"use client";
import { useTheme } from "next-themes";
import { SunIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Set initial theme based on system preference
    const initialTheme: any = theme === "system" ? systemTheme : theme;
    setCurrentTheme(initialTheme);
  }, [systemTheme, theme]);

  const handleThemeChange = (newTheme: string) => {
    setAnimating(true);
    setTimeout(() => {
      setTheme(newTheme);
      setCurrentTheme(newTheme);
      setAnimating(false);
    }, 300); // Duration of the animation in milliseconds
  };

  const renderThemeChanger = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <div
          className={`w-10 h-10 flex justify-center items-center rounded-md bg-[#805AD5] dark:bg-[#FBD38D] transition-transform duration-300 ${animating ? 'rotate-180' : ''}`}
          role="button"
          onClick={() => handleThemeChange('light')}
        >
          <SunIcon className="w-6 h-6 text-black" />
        </div>
      );
    } else {
      return (
        <div
          className={`w-10 h-10 flex justify-center items-center rounded-md bg-[#805AD5] dark:bg-[#FBD38D] transition-transform duration-300 ${animating ? 'rotate-180' : ''}`}
          role="button"
          onClick={() => handleThemeChange('dark')}
        >
          <MoonIcon className="w-6 h-6 text-white" />
        </div>
      );
    }
  };

  return (
    <>
      {renderThemeChanger()}
    </>
  );
};

export default ThemeSwitcher;

