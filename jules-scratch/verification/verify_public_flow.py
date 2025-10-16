import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # 1. Navigate to the catalog page
        await page.goto("http://localhost:5173/catalogo")

        # 2. Wait for the loading message to disappear
        loading_message_locator = page.get_by_text("Cargando propiedades...")
        await expect(loading_message_locator).to_be_hidden(timeout=10000)

        # 3. Now, verify the error message is displayed
        error_message_locator = page.locator("div:has-text('Error: No se pudieron cargar las propiedades.')")
        await expect(error_message_locator).to_be_visible()

        # 4. Verify that protected links are not visible
        await expect(page.get_by_role("link", name="Nosotros")).not_to_be_visible()

        # 4. Verify that the "Login" link is visible
        login_link_locator = page.get_by_role("link", name="Login")
        await expect(login_link_locator).to_be_visible()

        # 5. Take a screenshot of the public catalog page
        await page.screenshot(path="jules-scratch/verification/public_catalog_error_and_header.png")

        # 6. Click the "Login" link
        await login_link_locator.click()

        # 7. Verify the redirection to the login page
        await expect(page).to_have_url("http://localhost:5173/login", timeout=10000)

        # 8. Take a screenshot of the login page
        await page.screenshot(path="jules-scratch/verification/login_redirect_from_header.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())