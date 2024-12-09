const apiMonitor = (response) => {
    response.ok ? console.log('%c API Response %c' + response.config.url, 'background: #222; color: #2874A6; font-size: 15px',
        'background:#2874A6;color:white')
        : console.log('%c API Response %c' + response.config.url, 'background: #222; color: #2874A6; font-size: 15px',
            'background:red;color:white');
};

export default apiMonitor;