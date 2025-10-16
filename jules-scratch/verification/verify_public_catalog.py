import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # 1. Navigate to the catalog page directly
        await page.goto("http://localhost:5173/catalogo")

        # 2. Wait for the properties to load by looking for the main house display
        main_house_display_locator = page.locator(f"div[class*='MainHouseDisplay_container__']")
        await expect(main_house_display_locator).to_be_visible(timeout=10000)

        # 3. Take a screenshot of the public catalog
        await page.screenshot(path="jules-scratch/verification/public_catalog.png")

        # 4. Find the favorite button and click it
        favorite_button_locator = page.locator(f"button[title='Agregar a la lista de favoritos']")
        await favorite_button_locator.click()

        # 5. Verify the redirection to the login page
        await expect(page).to_have_url("http://localhost:5173/login", timeout=10000)

        # 6. Take a screenshot of the login page
        await page.screenshot(path="jules-scratch/verification/login_redirect_from_catalog.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())