﻿import * as React from "react";
import ResumeComponent, { ResumeComponentProps } from "./ResumeComponent";
import EditButton, { AddButton, DownButton, UpButton, DeleteButton } from "./Buttons";

export interface EntryProps extends ResumeComponentProps {
    title?: string;
    subtitle?: string;
}

export default class Entry extends ResumeComponent<EntryProps> {
    constructor(props) {
        super(props);
    }
    
    render() {
        let buttons = <div style={{ float: "right" }}>
            <AddButton action={this.addList} />
            <EditButton {...this.props} />
            <DeleteButton {...this.props} />
            <UpButton {...this.props} />
            <DownButton {...this.props} />
        </div>

        let title: any = this.props.title || "Enter a title";
        let subtitle: any = this.props.subtitle || "Enter a subtitle";

        if (this.props.isEditing) {
            title = <input onChange={this.updateData.bind(this, "title")} value={this.props.title || ""} />
            subtitle = <input onChange={this.updateData.bind(this, "subtitle")} value={this.props.subtitle || ""} />
        }

        return <div>
            <h3>{title} {buttons}</h3>
            <p className="subtitle">{subtitle}</p>

            {this.renderChildren()}
        </div>
    }
}