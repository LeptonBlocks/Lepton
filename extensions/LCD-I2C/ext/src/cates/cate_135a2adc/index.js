import blocks from './blocks.js';

const cate_135a2adc = (facepanels) => ({
    "name": "cate_135a2adc",
    "colors": [
        "#008080",
        "#007373",
        "#006666"
    ],
    "menuIconURI": window.MbApi.getExtResPath('lepton_lcd_i2c/imgs/aeef3c51_desktop-solid.svg', 'lepton_lcd_i2c'),
    "blockIcon": {
        "type": "image",
        "width": 28,
        "height": 26,
        "src": window.MbApi.getExtResPath('lepton_lcd_i2c/imgs/e54a98bd_desktop-solid (1).svg', 'lepton_lcd_i2c')
    },
    "blocks": blocks(facepanels),
    "menus": {
        "BLOCK_1713207948139_PORT": [{
                "text": "BLOCK_1713207948139_PORT_0",
                "value": "0x20"
            },
            {
                "text": "BLOCK_1713207948139_PORT_1",
                "value": "0x27"
            },
            {
                "text": "BLOCK_1713207948139_PORT_2",
                "value": "0x30"
            },
            {
                "text": "BLOCK_1713207948139_PORT_3",
                "value": "0x38"
            },
            {
                "text": "BLOCK_1713207948139_PORT_4",
                "value": "0x3F"
            }
        ],
        "BLOCK_1713209371216_COMMAND": [{
                "text": "BLOCK_1713209371216_COMMAND_0",
                "value": "clear"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_1",
                "value": "clearEOL"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_2",
                "value": "backlight"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_3",
                "value": "noBacklight"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_4",
                "value": "display"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_5",
                "value": "noDisplay"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_6",
                "value": "blink"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_7",
                "value": "noBlink"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_8",
                "value": "cursor"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_9",
                "value": "noCursor"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_10",
                "value": "scrollDisplayLeft"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_11",
                "value": "scrollDisplayRight"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_12",
                "value": "autoscroll"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_13",
                "value": "noAutoscroll"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_14",
                "value": "leftToRight"
            },
            {
                "text": "BLOCK_1713209371216_COMMAND_15",
                "value": "rightToLeft"
            }
        ],
        "BLOCK_1713210317522_DIRECTION": [{
                "text": "BLOCK_1713210317522_DIRECTION_0",
                "value": "Right"
            },
            {
                "text": "BLOCK_1713210317522_DIRECTION_1",
                "value": "Left"
            }
        ],
        "BLOCK_1713208634623_CHAR": [{
                "text": "BLOCK_1713208634623_CHAR_0",
                "value": "ALPHA"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_1",
                "value": "BETA"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_2",
                "value": "EPSILON"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_3",
                "value": "MU"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_4",
                "value": "RHO"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_5",
                "value": "SQROOT"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_6",
                "value": "THETA"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_7",
                "value": "INFINITY"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_8",
                "value": "OHM"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_9",
                "value": "SIGMA"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_10",
                "value": "PI"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_11",
                "value": "XAVG"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_12",
                "value": "DEGREE"
            },
            {
                "text": "BLOCK_1713208634623_CHAR_13",
                "value": "DIVIDE"
            }
        ],
        "BLOCK_1713210693769_N": [{
                "text": "BLOCK_1713210693769_N_0",
                "value": "1"
            },
            {
                "text": "BLOCK_1713210693769_N_1",
                "value": "2"
            },
            {
                "text": "BLOCK_1713210693769_N_2",
                "value": "3"
            },
            {
                "text": "BLOCK_1713210693769_N_3",
                "value": "4"
            },
            {
                "text": "BLOCK_1713210693769_N_4",
                "value": "5"
            },
            {
                "text": "BLOCK_1713210693769_N_5",
                "value": "6"
            },
            {
                "text": "BLOCK_1713210693769_N_6",
                "value": "7"
            },
            {
                "text": "BLOCK_1713210693769_N_7",
                "value": "8"
            }
        ]
    }
});

export default cate_135a2adc;