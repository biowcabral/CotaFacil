from selenium import webdriver
import unittest

class TestExample(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_hello_world(self):
        self.driver.get("http://example.com")
        self.assertIn("Example Domain", self.driver.title)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()