import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useAuthCheckQuery from '../queries/authCheckQuery.jsx';

function SetPatchDropDown({ setIsNameTextOpen, nameValue, setErrorMessage }) {
    const [open, setOpen] = useState(false);
    const dropDownRef = useRef();
    const queryClient = useQueryClient();
    const authCheckQ = useAuthCheckQuery(true);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if (!dropDownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);

    function handleOpenClick() {
        setOpen(!open);
    }

    function handleEditClick() {
        setOpen(!open);
        setIsNameTextOpen(true);
    }

    const publishSetM = useMutation({
        mutationFn: () => axios.patch(`https://api.boxcards.app/api/sets/${params.sid}`, { name: nameValue, isPublished: true }).then((res) => res.data),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['setCardsQ', params.sid] });
            queryClient.setQueryData(['setInfoQ', params.sid], data);
        },
    });

    function handlePublishClick() {
        setOpen(!open);
        setErrorMessage('Publishing ...');
        publishSetM.mutate('zzz', {
            onError: () => {
                setErrorMessage('Error Publishing Set, Try Again');
            },
            onSuccess: () => {
                setErrorMessage(null);
            },
        });
    }

    const deleteSetM = useMutation({
        mutationFn: () => axios.delete(`https://api.boxcards.app/api/sets/${params.sid}`).then((res) => res.data),
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ['authUserSetsQ'] });
        },
    });

    function handleDeleteClick() {
        setOpen(!open);
        setErrorMessage('Deleting ...');
        deleteSetM.mutate('zzz', {
            onError: (err) => {
                setErrorMessage('Error Deleting Set, Try Again');
            },
            onSuccess: () => {
                setErrorMessage(null);
                navigate(`/boxes/${authCheckQ.data.username}`);
            },
        });
    }

    return (
        <div className="relative" ref={dropDownRef}>
            <div onClick={handleOpenClick} className={`cursor-pointer buttonStyle h-[2.15rem] w-9 flex justify-center items-center ${open ? 'ring-1 ring-fillPrimary' : ''} group`}>
                <svg
                    className={`h-1 ${open ? 'fill-white' : 'fill-white'}`}
                    viewBox="0 0 38.099999 8.4666676"
                    xmlns="http://www.w3.org/2000/svg">
                    <defs />
                    <g
                        transform="translate(-8.4666663,-8.4666652)">
                        <circle
                            cx="12.7"
                            cy="12.7"
                            r="4.2333331" />
                        <circle
                            cx="27.516666"
                            cy="12.7"
                            r="4.2333331" />
                        <circle
                            cx="42.333332"
                            cy="12.699999"
                            r="4.2333331" />
                    </g>
                </svg>
            </div>

            <ul className={`absolute min-w-max z-50 mt-2.5 right-0 ${open ? 'block' : 'hidden'} motion-safe:fadeInFast`}>
                <SetPatchDropDownItem name={'Edit Name'} handleItemClick={handleEditClick} />
                <SetPatchDropDownItem name={'Publish Set'} handleItemClick={handlePublishClick}/>
                <SetPatchDropDownItem name={'Delete Set'} handleItemClick={handleDeleteClick}/>
            </ul>
        </div>
    );
}

function SetPatchDropDownItem({ name, handleItemClick }) {
    return <li onClick={handleItemClick} className="dropDownItem">
        {name}
    </li>;
}

export default SetPatchDropDown;
