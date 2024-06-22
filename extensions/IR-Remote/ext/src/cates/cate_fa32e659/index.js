import blocks from './blocks.js';

const cate_fa32e659 = (facepanels) => ({
    "name": "cate_fa32e659",
    "colors": [
        "#008080",
        "#007373",
        "#006666"
    ],
    "menuIconURI": window.MbApi.getExtResPath('lepton_ir_remote/imgs/60af48d4_gamepad-solid.svg', 'lepton_ir_remote'),
    "blockIcon": {
        "type": "image",
        "width": 28,
        "height": 26,
        "src": window.MbApi.getExtResPath('lepton_ir_remote/imgs/669ec287_gamepad-solid (1).svg', 'lepton_ir_remote')
    },
    "blocks": blocks(facepanels),
    "menus": {}
});

export default cate_fa32e659;