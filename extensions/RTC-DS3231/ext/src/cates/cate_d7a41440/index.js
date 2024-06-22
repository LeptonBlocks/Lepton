import blocks from './blocks.js';

const cate_d7a41440 = (facepanels) => ({
    "name": "cate_d7a41440",
    "colors": [
        "#008080",
        "#007373",
        "#006666"
    ],
    "menuIconURI": window.MbApi.getExtResPath('lepton_rtc_ds3231/imgs/c92a321d_clock-regular.svg', 'lepton_rtc_ds3231'),
    "blockIcon": {
        "type": "image",
        "width": 28,
        "height": 26,
        "src": window.MbApi.getExtResPath('lepton_rtc_ds3231/imgs/1b272a1f_clock-regular (2).svg', 'lepton_rtc_ds3231')
    },
    "blocks": blocks(facepanels),
    "menus": {
        "BLOCK_1713175967062_FIELD": [{
                "text": "BLOCK_1713175967062_FIELD_0",
                "value": "year"
            },
            {
                "text": "BLOCK_1713175967062_FIELD_1",
                "value": "month"
            },
            {
                "text": "BLOCK_1713175967062_FIELD_2",
                "value": "day"
            },
            {
                "text": "BLOCK_1713175967062_FIELD_3",
                "value": "hour"
            },
            {
                "text": "BLOCK_1713175967062_FIELD_4",
                "value": "minute"
            },
            {
                "text": "BLOCK_1713175967062_FIELD_5",
                "value": "second"
            },
            {
                "text": "BLOCK_1713175967062_FIELD_6",
                "value": "dayOfWeek"
            },
            {
                "text": "BLOCK_1713175967062_FIELD_7",
                "value": "unixtime"
            }
        ]
    }
});

export default cate_d7a41440;