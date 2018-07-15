/// <reference path="../references.d.ts" />
import * as common from './blurview.common';
import * as app from 'application';
import * as fs from 'file-system';
import * as utils from 'utils/utils';
import * as types from 'utils/types';
import * as imageSrc from 'image-source';
import * as platform from 'platform';
import { View, layout, PercentLength, Length } from 'ui/core/view';
import { Color } from 'color';
global.moduleMerge(common, exports);

declare global {
    namespace eightbitlab {
        namespace com {
            namespace blurview {
                class BlurView extends android.widget.FrameLayout {
                    setupWith(rootView): this;
                    windowBackground(background): this;
                    blurAlgorithm(algo): this;
                    blurRadius(radius): this;
                    setHasFixedTransformationMatrix(value): this;
                }
                class RenderScriptBlur {
                    constructor(context);
                }
            }
        }
    }
}

export class BlurView extends common.BlurView {
    nativeViewProtected: eightbitlab.com.blurview.BlurView;
    constructor() {
        super();
    }

    get android(): eightbitlab.com.blurview.BlurView {
        return this.nativeView;
    }
    public createNativeView() {
        const blurView = new eightbitlab.com.blurview.BlurView(this._context);
        const decorView = this._context.getWindow().getDecorView();
        // ViewGroup you want to start blur from. Choose root as close to BlurView in hierarchy as possible.
        const rootView = decorView.getRootView();
        // set background, if your root layout doesn't have one
        const windowBackground = decorView.getBackground();

        console.log('create blur view', this.blurRadius);
        blurView
            .setupWith(rootView)
            .windowBackground(windowBackground)
            .blurAlgorithm(new eightbitlab.com.blurview.RenderScriptBlur(this._context))
            .blurRadius(this.blurRadius)
            .setHasFixedTransformationMatrix(true);
        return blurView;
    }

    viewInit = false;
    public initNativeView() {
        super.initNativeView();
        this.viewInit = true;
    }
    [common.blurRadiusProperty.setNative](value: number) {
        this.blurRadius = value;
        if (this.nativeView) {
            console.log('blurRadiusProperty', value);
            (this.nativeView as eightbitlab.com.blurview.BlurView).blurRadius(value);
        }
    }
}