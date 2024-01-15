import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';

function EditableText({ open, setOpen, textValue, textRenderQueryKey, setErrorMessage, patchURL, extraBody, isName, maxLen, bgColor }) {
    const queryClient = useQueryClient();
    const [newTextValue, setNewTextValue] = useState(textValue);

    const textAreaRef = useRef();

    function handleChange(event) {
        const value = event.target.value;

        if (newTextValue.length >= maxLen && value.length >= maxLen) {
            setErrorMessage(`Max ${maxLen} character name`);
        } else if (value.length > maxLen) {
            setErrorMessage(`Max ${maxLen} character name`);
            setNewTextValue(value.substring(0, maxLen));
        } else {
            setNewTextValue(value);
            setErrorMessage(null);
        }
    }

    const patchTextM = useMutation({
        mutationFn: () => {
            if (isName) {
                return axios.patch(patchURL, { ...extraBody, name: newTextValue }).then((res) => res.data);
            } else {
                return axios.patch(patchURL, { ...extraBody, text: newTextValue }).then((res) => res.data);
            }
        },

        onMutate: async () => {
            const previousContext = queryClient.getQueryData(textRenderQueryKey);
            if (isName) {
                queryClient.setQueryData(textRenderQueryKey, (old) => {
                    const aa = { ...old, name: newTextValue };
                    return aa;
                });
            } else {
                queryClient.setQueryData(textRenderQueryKey, (old) => {
                    const aa = { ...old, text: newTextValue };
                    return aa;
                });
            }
            setErrorMessage(null);
            return { previousContext };
        },
        onError: (error, zzz, context) => {
            queryClient.setQueryData(textRenderQueryKey, context.previousContext);
            setErrorMessage(error.response.data.error.message);
            if (isName) {
                setNewTextValue(context.previousContext.name);
            } else {
                setNewTextValue(context.previousContext.text);
            }
        },
        onSuccess: (data, zzz, context) => {
            queryClient.setQueryData(textRenderQueryKey, data);
            setErrorMessage(null);
        },
    });

    useEffect(() => {
        const handler = (e) => {
            if (textAreaRef.current !== undefined && textAreaRef.current !== null) {
                if (!textAreaRef.current.contains(e.target)) {
                    patchTextM.mutate();
                    setOpen(false);
                }
            }
        };

        document.addEventListener('click', handler, true);

        return () => {
            document.removeEventListener('click', handler, true);
        };
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Enter') {
                patchTextM.mutate();
                setOpen(false);
                e.preventDefault();
            }
        };

        if (open) {
            document.addEventListener('keydown', handler);
        }

        return () => {
            document.removeEventListener('keydown', handler);
        };
    }, [open]);

    if (open === true) {
        return (
            <TextareaAutosize autoFocus onChange={handleChange} value={newTextValue} className={`w-full focus:outline-none align-top resize-none bg-${bgColor} text-blue-300`} id="setNameArea" ref={textAreaRef}
                onFocus={function (e) {
                    const val = e.target.value;
                    e.target.value = '';
                    e.target.value = val;
                }}/>
        );
    } else {
        return <span className=''>{textValue}</span>;
    }
}

export default EditableText;
