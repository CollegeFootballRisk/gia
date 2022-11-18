
	export const settings = writable('settings', {
        lightmode: false,
        images: false,
	})
  import { writable } from 'svelte-local-storage-store';

    let darkMode = true;

  function handleSwitchDarkMode() {
      darkMode = !darkMode;

      localStorage.setItem('theme', darkMode ? 'dark' : 'light');

      darkMode
          ? document.documentElement.classList.add('dark')
          : document.documentElement.classList.remove('dark');
  }

      if (
          localStorage.theme === 'dark' ||
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
          document.documentElement.classList.add('dark');
          darkMode = true;
      } else {
          document.documentElement.classList.remove('dark');
          darkMode = false;
      }