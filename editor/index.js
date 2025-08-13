(function (wp) {
    const { addFilter } = wp.hooks;
    const { createElement, Fragment } = wp.element;
    const { InspectorControls } = wp.blockEditor || wp.editor;
    const { PanelBody, SelectControl, ToggleControl, RangeControl } = wp.components;

    // Register new attribute for all blocks
    addFilter('blocks.registerBlockType', 'transition-fade-in/attributes', function (settings) {
        if (typeof settings.attributes !== 'undefined') {
            settings.attributes = Object.assign({}, settings.attributes, {
                slide: { type: 'boolean', default: false },
                slideDirection: { type: 'string', default: 'left' },
                slideThreshold: { type: 'number', default: 0.1 },
                slideSpeed: { type: 'number', default: 1 },
                slideDistance: { type: 'number', default: 20 },

                // Responsive overrides (nullable — use `null` to mean "not set")
                slideSpeedMd: { type: 'number', default: null },
                slideSpeedSm: { type: 'number', default: null },

                slideDistanceMd: { type: 'number', default: null },
                slideDistanceSm: { type: 'number', default: null }
            });
        }
        return settings;
    });

    // Add controller in the Gutenberg editor sidepanel
    addFilter('editor.BlockEdit', 'transition-fade-in/inspector-controls', function (BlockEdit) {
        return function (props) {
            const { attributes, setAttributes, isSelected } = props;
            const {
                slide,
                slideDirection,
                slideThreshold,
                slideSpeed,
                slideDistance,

                slideSpeedSm, slideSpeedMd,
                slideDistanceSm, slideDistanceMd
            } = attributes;

            // const [visible, setVisible] = React.useState(false);

            // // Kör en effekt som triggar animationen direkt i editorn
            // React.useEffect(() => {
            //     if (!slide) {
            //         setVisible(false);
            //         return;
            //     }

            //     setVisible(false);
            //     const timer = setTimeout(() => {
            //         setVisible(true);
            //     }, 300); // liten fördröjning för animation

            //     return () => clearTimeout(timer);
            // }, [slide, slideDirection, slideSpeed, slideDistance]);

            // // Beräkna start-transform
            // let startTransform = 'translateX(0)';
            // switch (slideDirection) {
            //     case 'right': startTransform = `translateX(${slideDistance}%)`; break;
            //     case 'up': startTransform = `translateY(-${slideDistance}%)`; break;
            //     case 'down': startTransform = `translateY(${slideDistance}%)`; break;
            //     default: startTransform = `translateX(-${slideDistance}%)`;
            // }

            // // Style för animation i editorn
            // const animationStyle = slide ? {
            //     opacity: visible ? 1 : 0,
            //     transform: visible ? 'translateX(0) translateY(0)' : startTransform,
            //     transition: `opacity ${slideSpeed}s ease, transform ${slideSpeed}s ease`,
            // } : {};

            const controls = isSelected
                ? createElement(
                    InspectorControls,
                    {},
                    createElement(PanelBody, { title: 'Slide-in Animation', initialOpen: false },
                        createElement(ToggleControl, {
                            label: 'Enable Slide-in',
                            checked: slide,
                            onChange: (value) => setAttributes({ slide: value }),
                        }),
                        slide && createElement(
                            Fragment, {},
                            createElement(SelectControl, {
                                label: 'From direction',
                                value: slideDirection,
                                options: [
                                    { label: 'Left', value: 'left' },
                                    { label: 'Right', value: 'right' },
                                    { label: 'Up', value: 'up' },
                                    { label: 'Down', value: 'down' }
                                ],
                                onChange: (value) => setAttributes({ slideDirection: value }),
                            }),
                            createElement(RangeControl, {
                                label: 'Trigger threshold (%)',
                                value: slideThreshold,
                                min: 0.1,
                                max: 1,
                                step: 0.1,
                                onChange: (value) => setAttributes({ slideThreshold: value }),
                            }),
                            createElement(RangeControl, {
                                label: 'Animation speed',
                                value: slideSpeed,
                                min: 0,
                                max: 3,
                                step: 0.5,
                                onChange: (value) => setAttributes({ slideSpeed: value }),
                            }),
                            createElement(RangeControl, {
                                label: 'Slide-in distance',
                                value: slideDistance,
                                min: 0,
                                max: 90,
                                step: 5,
                                onChange: (value) => setAttributes({ slideDistance: value }),
                            }),

                            // Responsive panels

                            createElement(PanelBody, { title: 'Medium Screens', initialOpen: false },
                                createElement(RangeControl, {
                                    label: 'Animation speed',
                                    value: slideSpeedMd,
                                    min: 0,
                                    max: 3,
                                    step: 0.5,
                                    onChange: (value) => setAttributes({ slideSpeedMd: value }),
                                }),
                                createElement(RangeControl, {
                                    label: 'Slide-in distance',
                                    value: slideDistanceMd,
                                    min: 0,
                                    max: 90,
                                    step: 5,
                                    onChange: (value) => setAttributes({ slideDistanceMd: value }),
                                })
                            ),

                            createElement(PanelBody, { title: 'Small Screens', initialOpen: false },
                                createElement(RangeControl, {
                                    label: 'Animation speed',
                                    value: slideSpeedSm,
                                    min: 0,
                                    max: 3,
                                    step: 0.5,
                                    onChange: (value) => setAttributes({ slideSpeedSm: value }),
                                }),
                                createElement(RangeControl, {
                                    label: 'Slide-in distance',
                                    value: slideDistanceSm,
                                    min: 0,
                                    max: 90,
                                    step: 5,
                                    onChange: (value) => setAttributes({ slideDistanceSm: value }),
                                }),
                            )
                        )
                    )
                ) : null;

            return createElement(Fragment, {}, createElement(BlockEdit, props), controls);
            // return createElement(Fragment, {}, createElement('div', { style: animationStyle }, createElement(BlockEdit, props)), controls);
        };
    });

    // Add wrapper-attribut (data-*)
    addFilter(
        'blocks.getSaveContent.extraProps',
        'transition-fade-in/wrapper-props',
        function (props, blockType, attributes) {
            const {
                slide,
                slideDirection,
                slideThreshold,
                slideSpeed,
                slideDistance,

                slideSpeedSm, slideSpeedMd,
                slideDistanceSm, slideDistanceMd
            } = attributes;

            if (slide) {
                props['data-slide'] = true;
                props['data-slide-direction'] = slideDirection;
                props['data-slide-speed'] = slideSpeed;
                props['data-slide-threshold'] = slideThreshold;
                props['data-slide-distance'] = slideDistance;

                // Responsive attributes only when explicitly set (not null)
                if (slideSpeedSm !== null) props['data-slide-speed-sm'] = slideSpeedSm;
                if (slideSpeedMd !== null) props['data-slide-speed-md'] = slideSpeedMd;

                if (slideDistanceSm !== null) props['data-slide-distance-sm'] = slideDistanceSm;
                if (slideDistanceMd !== null) props['data-slide-distance-md'] = slideDistanceMd;
            }
            return props;
        }
    );
})(window.wp);
