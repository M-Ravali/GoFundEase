// Import necessary modules
require('@testing-library/jest-dom');
const { screen, fireEvent } = require('@testing-library/dom');

// Mock the window.open function
global.window.open = jest.fn();

describe('Header and Navigation Bar Functionality Test', () => {
  beforeEach(() => {
    // Reset mocks and reset HTML
    jest.clearAllMocks();
    document.body.innerHTML = `
      <header class="site-header">
        <!-- Mocked header content -->
      </header>

      <nav class="navbar navbar-expand-lg bg-light shadow-lg">
        <!-- Mocked navigation bar content -->
      </nav>

      <main>
        <!-- Mocked main content -->
      </main>
    `;
  });

  test('Social icons in header navigate to correct URLs', () => {
    const socialIcons = document.querySelectorAll('.social-icon-link');
    socialIcons.forEach((icon) => {
      icon.click();
      expect(window.open).toHaveBeenCalledWith(expect.stringContaining(icon.classList[1]), '_blank');
    });
  });

  test('Navigation links scroll to correct sections', () => {
    const navigationLinks = document.querySelectorAll('.click-scroll');
    navigationLinks.forEach((link) => {
      link.click();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      expect(targetSection).toBeInTheDocument();
    });
  });

  // Add more test cases as needed
});
