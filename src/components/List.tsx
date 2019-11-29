﻿import * as React from "react";
import ResumeComponent, { AddChild, UpdateChild, Action, ResumeComponentProps, SelectedComponentProps } from "./ResumeComponent";
import EditButton, { DeleteButton, AddButton, DownButton, UpButton } from "./Buttons";
import { Button, ButtonGroup } from "react-bootstrap";
import ReactQuill from "react-quill";
import { Nonprintable } from "./Nonprintable";
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

interface ListProps extends ResumeComponentProps {
    isMoving?: boolean;
}

export class ListItem extends ResumeComponent<ListProps> {
    constructor(props) {
        super(props);
    }

    static quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['link'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    render() {
        let value: any = "";
        let moveButtons = this.props.isMoving ? <React.Fragment>
            <UpButton {...this.props} />
            <DownButton {...this.props} />
        </React.Fragment> : "";

        if (this.props.value) {
            let htmlCode = this.props.value;

            // Strip out parent <p> tags since we don't need them
            if (htmlCode.slice(0, 3) == '<p>' && htmlCode.slice(-4) == '</p>') {
                htmlCode = htmlCode.slice(3, htmlCode.length - 4);
            }
            
            value = <span
                dangerouslySetInnerHTML={{ __html: htmlCode }}
            />
        }

        if (this.props.isEditing) {
            value = <ReactQuill
                modules={ListItem.quillModules}
                value={this.props.value || ""}
                onChange={((this.props.updateData as (key: string, data: any) => void).bind(this, "value") as (data: any) => void)}
            />
        }

        return <li>
            <span className="flex-row">
                <span>{value}</span>

                <Nonprintable isPrinting={this.props.isPrinting}>
                    <span>
                        <EditButton {...this.props} />
                        <DeleteButton {...this.props} />
                        {moveButtons}
                    </span>
                </Nonprintable>
                </span>
        </li>
    }
}

interface ListState {
    isSelected: boolean;
}

export default class List extends ResumeComponent<ListProps, ListState> {
    constructor(props) {
        super(props);

        this.state = {
            isSelected: false
        };

        this.addChild = this.addChild.bind(this);
        this.moveBullets = this.moveBullets.bind(this);
        this.setSelected = this.setSelected.bind(this);
        this.unselect = this.unselect.bind(this);
    }

    addChild() {
        if (this.props.addChild as AddChild) {
            (this.props.addChild as AddChild)({
                type: 'ListItem'
            });
        }
    }

    moveBullets() {
        let children = this.props.children as Array<object>;
        let isMoving = this.props.isMoving ? false : true; // Flip
        children.forEach((node) => {
            node['isMoving'] = isMoving
        });

        // Replace node's children with new list of children that excludes deleted node
        this.updateData("isMoving", isMoving);
        this.updateData("children", children);
    }

    setSelected() {
        if (!this.state.isSelected) {
            this.setState({ isSelected: true });
            if (this.props.unselect as Action) {
                (this.props.unselect as Action)();
            }
            (this.props.updateSelected as (data: SelectedComponentProps) => void)({
                unselect: this.unselect.bind(this)
            });
        }
    }

    unselect() {
        this.setState({
            isSelected: false
        });
    }

    render() {
        let moveText = this.props.isMoving ? "Done Moving" : "Move Bullets";
        let style = {};
        let buttons = <></>
        if (this.state.isSelected) {
            style = {
                border: "2px solid blue"
            };

            buttons = <Nonprintable isPrinting ={ this.props.isPrinting }>
                <li className="list-options">
                    <ButtonGroup>
                        <Button onClick={this.addChild} size="sm">Add Bullet</Button>
                        <Button onClick={this.moveBullets} size="sm">{moveText}</Button>
                    </ButtonGroup>

                    <Button onClick={this.props.deleteChild as Action} size="sm" variant="danger">Delete List</Button>
                </li>
            </Nonprintable>
        }

        return <React.Fragment>
            <MenuProvider id={this.props.id as string}>
                <ul onClick={this.setSelected} style={style}>
                    {this.renderChildren()}
                    {buttons}
                </ul>
            </MenuProvider>
            <Menu id={this.props.id as string}>
                <Item onClick={this.addChild}>Add Bullet</Item>
                <Item onClick={this.moveBullets}>{moveText}</Item>
                <Item onClick={this.props.deleteChild as Action}>Delete List</Item>
            </Menu>
        </React.Fragment>
    }
}