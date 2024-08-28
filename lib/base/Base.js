let commands = [];

function Module(config, handler) {
    let commandDetails = {
        'pattern': config['pattern'],
        'on': config['on'],
        'type': config['type'] || 'all',
        'DismissPrefix': config['DismissPrefix'],
        'allowBot': config['allowBot'],
        'fromMe': config['fromMe'] === undefined ? true : config['fromMe'],
        'onlyGroup': config['onlyGroup'],
        'react': config['react'],
        'onlyPm': config['onlyPm'],
        'desc': config['desc'] || '',
        'usage': config['usage'] || '',
        'dontAddCommandList': config['dontAddCommandList'] || false,
        'media': config['media'] || 'others',
        'function': handler,
        'root': config['root']
    };
    commands.push(commandDetails);
    return commandDetails;
}

module.exports = {
    'Module': Module,
    'commands': commands
};
