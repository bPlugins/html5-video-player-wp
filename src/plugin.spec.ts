import { test, expect } from "@playwright/test";


const removeBlocks = async (page: any) => {
    await page.evaluate(() => {
        const wp = (window as any).wp;
        const blocks = wp.data.select('core/block-editor').getBlocks();
        const clientIds = blocks.map((block: any) => block.clientId);
        if (clientIds.length > 0) {
            wp.data.dispatch('core/block-editor').removeBlocks(clientIds);
        }
    });
}

const isBlockExists = async (page: any, blockName: string) => {
    await page.evaluate((blockName: string) => {
        const wp = (window as any).wp;
        const blocks = wp.data.select('core/block-editor').getBlocks();
        console.log(blocks);
        if (blocks.length && blocks[0].name === blockName) {
            return true;
        }
        return false;
    }, blockName);
}

const takeScreenshot = async (page: any, testInfo: any, fileName: string = 'screenshot') => { // random name
    const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const screenshot = await page.screenshot({ path: `screenshots/${fileName}-${randomName}.png` });
    await testInfo.attach('Final State', {
        body: screenshot,
        contentType: 'image/png',
    });
}

test("WordPress dashboard loads", async ({ page }, testInfo) => {

    await page.goto("/wp-admin/post.php?post=4153&action=edit");

    await removeBlocks(page);
    await page.getByRole('button', { name: 'Add Block' }).click();
    await page.getByRole('searchbox', { name: 'Search' }).fill('html5 video player');
    await page.getByRole('option', { name: ' HTML5 Video Player' }).click();
    await page.getByRole('textbox', { name: 'URL' }).click();
    await page.getByRole('textbox', { name: 'URL' }).fill('https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4');
    await page.getByRole('button', { name: 'Apply' }).click();

    expect(await page.locator('div.wp-block-html5-player-video')).toBeVisible();
    await page.waitForTimeout(1000);

    // took screenshot
    await takeScreenshot(page, testInfo, 'video-block-added');

    await removeBlocks(page);
    await page.getByRole('button', { name: 'Add Block' }).click();
    await page.getByRole('searchbox', { name: 'Search' }).fill('youtube');
    await page.getByRole('option', { name: 'Youtube Player' }).click();
    await page.getByRole('textbox', { name: 'URL' }).fill('laiFsjn6eFI');
    await page.getByRole('button', { name: 'Apply' }).click();

    console.log('isBlockExists', await isBlockExists(page, 'html5-player/youtube'))

    // expect(await isBlockExists(page, 'html5-player/youtube')).toBe(true);
    await page.waitForTimeout(1000);

    // took screenshot
    await takeScreenshot(page, testInfo, 'youtube-block-added');

    await removeBlocks(page);
    await page.getByRole('button', { name: 'Add Block' }).click();
    await page.getByRole('searchbox', { name: 'Search' }).fill('vimeo');
    await page.getByRole('option', { name: 'Vimeo Player' }).click();
    await page.getByRole('textbox', { name: 'URL' }).click();
    await page.getByRole('textbox', { name: 'URL' }).fill('1138248349');
    await page.getByRole('button', { name: 'Apply' }).click();

    // expect(await isBlockExists(page, 'html5-player/vimeo')).toBe(true);
    await page.waitForTimeout(1000);

    // took screenshot
    await takeScreenshot(page, testInfo, 'vimeo-block-added');

    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'View Page', exact: true }).click();
    await page.waitForTimeout(2000);

    // took screenshot
    await takeScreenshot(page, testInfo, 'plugin-front-end');
});