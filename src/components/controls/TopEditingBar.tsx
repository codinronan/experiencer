﻿import React from "react";
import { Button } from "./Buttons";
import { Action, SelectedNodeProps, ModifyChild, AddChild } from "../ResumeNodeBase";
import { IdType } from "../utility/HoverTracker";
import PureMenu, { PureDropdown, PureMenuItem, PureMenuLink } from "./PureMenu";

interface NodeOption {
    text: string;
    node: object;
}

type AddOptions = Array<NodeOption>;

const addOptions: Map<string, NodeOption> = new Map<string, NodeOption>([
    ['Column', {
        text: 'Flexible Column',
        node: {
            type: 'FlexibleColumn'
        }
    }],

    [ 'Section', {
        text: 'Section',
        node: {
            type: 'Section'
        }
    }],

    [ 'Entry', {
        text: 'Entry',
        node: {
            type: 'Entry'
        }
    }],

    [ 'Paragraph', {
        text: 'Paragraph',
        node: { type: 'Paragraph' }
    }],

    ['Bulleted List', {
        text: 'Bulleted List',
        node: {
            type: 'Paragraph',
            value: '<ul><li></li></ul>'
        }
    }],

    ['Description List', {
        text: 'Description List',
        node: {
            type: 'DescriptionList',
            children: [{
                type: 'DescriptionListItem'
            }]
        }
    }],

    ['Description List Item', {
        text: 'Description List Item',
        node: { type: 'DescriptionListItem' }
    }]
]);

function addMap(type: string) {
    switch (type) {
        case 'FlexibleRow':
            return 'Column';
        case 'DescriptionList':
            return 'Description List Item';
        case 'Entry':
            return ['Bulleted List', 'Description List', 'Paragraph'];
        case 'Section':
            return ['Entry', 'Paragraph', 'Bulleted List', 'Description List'];
        default:
            return ['Section', 'Entry', 'Paragraph', 'Bulleted List', 'Description List'];
    }
}

interface AddOptionProps {
    options: string | Array<string>;
    addChild: AddChild;
    id: IdType;
}

/**
 * Return the button or menu for adding children to a node
 * @param options
 */
export function AddOption(props: AddOptionProps) {
    const options = props.options;

    if (Array.isArray(options)) {
        let optionsDetail: AddOptions = [];

        options.forEach((nodeType: string) => {
            optionsDetail.push(addOptions.get(nodeType) as NodeOption)
        });

        return <AddMenu options={optionsDetail} addChild={props.addChild} id={props.id} />
    }

    const node: NodeOption = addOptions.get(options as string) as NodeOption;
    return (
            <Button onClick={() => props.addChild(props.id, node.node)}>
                Add {options}
            </Button>
    );
}

interface AddMenuProps {
    options: AddOptions;
    addChild: AddChild;
    id: IdType;
}

/**
 * Dropdown menu with add options
 * @param props
 */
export function AddMenu(props: AddMenuProps) {
    const button = <Button>Insert</Button>

    return (
        <PureDropdown content={button}>
            {props.options.map((opt) =>
                <PureMenuItem key={opt.text} onClick={() => props.addChild(props.id, opt.node)}>
                    <PureMenuLink>
                        {opt.text}
                    </PureMenuLink>
                </PureMenuItem>
            )}
        </PureDropdown>
    );
}

export default function TopEditingBar(props: SelectedNodeProps) {
    const id = props.id;
    const additionalOptions = props.customOptions ? <>
        {props.customOptions.map((item) =>
            <Button onClick={item.action}>{item.text}</Button>
        )}
    </> : <></>

    const Item = (props: any) => <PureMenuItem onClick={props.onClick}>
        <Button>{props.children}</Button>
    </PureMenuItem>

    return <div id="toolbar">
        <PureMenu horizontal>
            <AddOption id={id} addChild={props.addChild as AddChild} options={props.childTypes} />
            <Item onClick={() => props.deleteChild(id)}>Delete</Item>
            <Item onClick={() => (props.toggleEdit as ModifyChild)(id)}>Edit</Item>
            <Item onClick={props.moveUp}>Move Up</Item>
            <Item onClick={props.moveDown}>Move Down</Item>
                {additionalOptions}
        </PureMenu>
    </div>
}