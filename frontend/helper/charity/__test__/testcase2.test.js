// Import necessary modules
require('@testing-library/jest-dom');
const { screen, fireEvent } = require('@testing-library/dom');

describe('Your test suite', () => {
  // Your test cases go here

  describe('Section 1: Welcome Section', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <section class="section-padding">
          <!-- Section 1 HTML content -->
          <h1>Welcome to GoFundEase</h1>
          <a role="link" href="donate.html">Featured Block 1</a>
          <a role="link" href="donate.html">Featured Block 2</a>
        </section>
      `;
    });

    test('Check if "Welcome to GoFundEase" text is present', () => {
      expect(screen.getByText('Welcome to GoFundEase')).toBeInTheDocument();
    });

    test('Check if all featured blocks are clickable', () => {
      const featuredBlocks = screen.getAllByRole('link');
      featuredBlocks.forEach((block) => {
        expect(block).toHaveAttribute('href', 'donate.html');
      });
    });
  });

  describe('Section 2: Our Story Section', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <section class="section-padding section-bg" id="section_2">
          <!-- Section 2 HTML content -->
          <h2>Our Story</h2>
          <h3>Our Mission</h3>
          <p>Founded</p>
          <p>Donations</p>
          <img src="story.jpg" alt="Our Story Image">
        </section>
      `;
    });

    test('Check if "Our Story" heading is present', () => {
      expect(screen.getByText('Our Story')).toBeInTheDocument();
    });

    test('Check if "Our Mission" section is present', () => {
      expect(screen.getByText('Our Mission')).toBeInTheDocument();
    });

    test('Check if "Founded" and "Donations" counters are present', () => {
      expect(screen.getByText('Founded')).toBeInTheDocument();
      expect(screen.getByText('Donations')).toBeInTheDocument();
    });

    test('Check if image is present in the section', () => {
      const image = screen.getByAltText('Our Story Image');
      expect(image).toBeInTheDocument();
    });
  });
});
