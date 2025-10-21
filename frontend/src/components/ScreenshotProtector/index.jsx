import React, { useEffect } from 'react';

const ScreenshotProtector = () => {
    useEffect(() => {
        const scriptConfig = document.createElement('script');
        scriptConfig.innerHTML = `
        var noPrint = true;
        var noCopy = true;
        var noScreenshot = true;
        var autoBlur = true;
        `;
        document.head.appendChild(scriptConfig);

        const scriptAntiCopy = document.createElement('script');
        scriptAntiCopy.src = 'https://pdfanticopy.com/noprint.js';
        scriptAntiCopy.type = 'text/javascript';
        document.head.appendChild(scriptAntiCopy);

        return () => {
        document.head.removeChild(scriptConfig);
        document.head.removeChild(scriptAntiCopy);
        };
    }, []);

    return null;
};

export default ScreenshotProtector;
