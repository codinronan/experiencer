﻿import * as React from "react";
import { ResumeComponentProps, Action } from "./ResumeComponent";

import AddIcon from "../icons/add-24px.svg";
import DeleteIcon from "../icons/delete-24px.svg";
import EditIcon from "../icons/edit-24px.svg";
import DoneIcon from "../icons/done-24px.svg";

interface AddButtonProps {
    action: () => void;
}

export function AddButton(props: AddButtonProps) {
    return <img onClick={props.action} src={AddIcon} alt='Add' />
}

export default function EditButton<P extends ResumeComponentProps>(props: P) {
    const editIcon = <img src={EditIcon} alt='Edit' />

    if (props.isEditing && props.toggleEdit as Action) {
        return <img onClick={props.toggleEdit as Action} src={DoneIcon} alt='Edit' />
    }

    return <img onClick={props.toggleEdit as Action} src={EditIcon} alt='Edit' />
}

export function DeleteButton<P extends ResumeComponentProps>(props: P) {
    return <img onClick={props.deleteChild as Action} src={DeleteIcon} alt='Delete' />
}