import { arcWidget } from './arcWidget.js';
import { textWidget } from './textWidget.js';
import { imageWidget } from './imageWidget.js';

export class widgetFactory {

    static create(widgetData, device) {

        if (!widgetData) return null;

        switch(widgetData.type) {

            case "arc": return new arcWidget(widgetData);
            case "text": return new textWidget(widgetData);
            case "image": return new imageWidget(widgetData, device);

        }

        return null;

    }

}