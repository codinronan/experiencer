﻿import * as React from "react";
import EditButton, { DeleteButton, DownButton, UpButton } from "./controls/Buttons";
import ResumeNodeBase, { ResumeNodeProps } from "./ResumeNodeBase";
import { Dropdown, ButtonGroup, Button, DropdownButton } from "react-bootstrap";
import RotateLeft from "../icons/rotate_left-24px.svg";
import RotateRight from "../icons/rotate_right-24px.svg";
import Placeholder from "./Placeholder";

export type SectionHeaderPosition = "left" | "top";

export interface SectionProps extends ResumeNodeProps {
    title: string;
    headerPosition?: SectionHeaderPosition;
}

export default class Section extends ResumeNodeBase<SectionProps> {
    constructor(props: SectionProps) {
        super(props);

        this.rotateLeft = this.rotateLeft.bind(this);
        this.rotateRight = this.rotateRight.bind(this);
    }

    getEditingMenu() {
        let editToolsClassName = this.props.headerPosition === 'left' ? 'btn-group-vertical' : '';
        let rotateButton = <Button onClick={this.rotateLeft}><img src={RotateLeft} alt="Place header on left" />Place Header on Left</Button>
        if (this.props.headerPosition === 'left') {
            rotateButton = <Button onClick={this.rotateRight}>
                <img src={RotateRight} alt="Place header on right" />Place Header on Top
            </Button>
        }

        if (this.isSelected) {
            return <ButtonGroup className={editToolsClassName} size="sm">
                <DropdownButton as={ButtonGroup} title="Add" id="add-options" size="sm">
                    <Dropdown.Item onClick={this.addEntry}>Entry</Dropdown.Item>
                    <Dropdown.Item onClick={this.addList}>Bulleted List</Dropdown.Item>
                    <Dropdown.Item onClick={this.addDescriptionList}>Description List</Dropdown.Item>
                    <Dropdown.Item onClick={this.addParagraph}>Paragraph</Dropdown.Item>
                </DropdownButton>
                <EditButton {...this.props} extended={true} />
                <DeleteButton {...this.props} extended={true} />
                <UpButton {...this.props} extended={true} />
                <DownButton {...this.props} extended={true} />
                {rotateButton}
            </ButtonGroup>
        }
    }
    
    rotateLeft() {
        this.updateData('headerPosition', 'left');
    }

    rotateRight() {
        this.updateData('headerPosition', 'top');
    }

    get sectionClassName(): string {
        let classNames = [this.className];
        classNames.push(this.props.headerPosition === 'left' ? 'flex-row' : '');
        return classNames.join(' ');
    }

    get h2ClassName(): string {
        return this.props.headerPosition === 'left' ? 'flex-col' : 'flex-row flex-spread';
    }

    render() {
        let title = <Placeholder text={this.props.title} alt="Add a title" />
        let helperText = <></>

        if (this.props.isEditing) {
            title = <input onChange={this.updateDataEvent.bind(this, "title")} type="text" value={this.props.title || ""} />;
        }

        if (this.isEmpty && !this.isSelected) {
            helperText = <p>This section is empty. Click here to select it and add content.</p>
        }

        return <>
            <section className={this.sectionClassName} {...this.selectTriggerProps}>
                {this.renderEditingMenu()}
                <h2 className={this.h2ClassName}>
                    {title}
                </h2>
                <div className="entry-content">
                    {this.renderChildren()}
                    {helperText}
                </div>
            </section>
        </>
    }
}