﻿import * as React from "react";
import ReactQuill from 'react-quill';

import * as Helpers from "./Helpers";
import ResumeNodeBase from "./ResumeNodeBase";
import { IdType } from "./utility/HoverTracker";

export default class RichText extends ResumeNodeBase {
    static quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    static get displayName() {
        return 'Rich Text';
    }

    get className() {
        return super.className + ' rich-text';
    }
    
    get selectTriggerProps() {
        const baseProps = super.selectTriggerProps;

        // Click to edit
        if (this.isSelected && !this.props.isEditing) {
            baseProps.onClick = () => {
                this.setSelected();
                this.toggleEdit();
            }
        }

        return baseProps;
    }

    render(): JSX.Element {
        const textValue = Helpers.process(this.props.value) as string || "Empty text";

        let value = this.isEditing ? <ReactQuill
            modules={RichText.quillModules}
            value={this.props.value || ""}
            onChange={((this.props.updateData as (id: IdType, key: string, data: any) => void).bind(this, this.props.id, "value") as (data: any) => void)}
        /> : <span className="resume-paragraph" dangerouslySetInnerHTML={{ __html: textValue }} />;

        return <div className={this.className} id={this.props.cssId} {...this.selectTriggerProps}>
            {value}
        </div>;
    }
}