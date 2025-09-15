import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Define a mobile viewport
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            is_mobile=True,
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        # 1. Verify Home Page
        await page.goto("http://localhost:5173")
        try:
            await expect(page.locator('.main-content')).to_be_visible()
            # Check for the hamburger menu
            await expect(page.locator('.hamburger-menu')).to_be_visible()
            await page.screenshot(path="jules-scratch/verification/home-mobile.png")
        except Exception as e:
            print("Failed to find .main-content. Page content is:")
            print(await page.content())
            raise e

        # 2. Verify Catalog Page
        # First, open the sidebar and click the link
        await page.locator('.hamburger-menu').click()
        await page.get_by_role("link", name="Catalogo").click()
        await expect(page.locator('.catalogo-body')).to_be_visible()
        await page.screenshot(path="jules-scratch/verification/catalog-mobile.png")

        # 3. Verify Advisors Page
        await page.locator('.hamburger-menu').click()
        await page.get_by_role("link", name="Asesores").click()
        await expect(page.locator('.asesores-content')).to_be_visible()
        await page.screenshot(path="jules-scratch/verification/advisors-mobile.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
