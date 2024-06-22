import blocks from './blocks.js';

const cate_e7a05eef = (facepanels) => ({
    "name": "cate_e7a05eef",
    "colors": [
        "#008080",
        "#007373",
        "#006666"
    ],
    "menuIconURI": window.MbApi.getExtResPath('lepton_max7219/imgs/ace60972_category.svg', 'lepton_max7219'),
    "blockIcon": {
        "type": "image",
        "width": 28,
        "height": 26,
        "src": window.MbApi.getExtResPath('lepton_max7219/imgs/aa58670e_block.svg', 'lepton_max7219')
    },
    "blocks": blocks(facepanels),
    "menus": {
        "BLOCK_1719043487366_POWERDOWN": [{
                "text": "BLOCK_1719043487366_POWERDOWN_0",
                "value": "false"
            },
            {
                "text": "BLOCK_1719043487366_POWERDOWN_1",
                "value": "true"
            }
        ],
        "BLOCK_1719043877542_ON": [{
                "text": "BLOCK_1719043877542_ON_0",
                "value": "true"
            },
            {
                "text": "BLOCK_1719043877542_ON_1",
                "value": "false"
            }
        ]
    }
});

export default cate_e7a05eef;