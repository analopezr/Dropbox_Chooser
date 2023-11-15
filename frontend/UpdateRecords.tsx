import { Text, Button, useBase, useCursor, useLoadable, useWatchable, useGlobalConfig,useRecordActionData } from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';
import HiltonLogoBase64 from './HiltonLogoBase64';
import Header from './Header';
import './UpdateRecords.scss';

function UpdateRecords() {
    const globalConfig = useGlobalConfig();
    const MAIN_TABLE_ID = globalConfig.get('selectedTableId') as string;
    const ASSET_TABLE_ID = globalConfig.get('selectedTableAssetsId') as string;

    const base = useBase();
    const tableToUpdate = base.getTableByIdIfExists(MAIN_TABLE_ID);
    const tableToCreateRecords = base.getTableByIdIfExists(ASSET_TABLE_ID);

    const cursor = useCursor();
    const [isChooserVisible, setIsChooserVisible] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);

    const recordActionData = useRecordActionData();
    const isButtonAction = !!recordActionData;

    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds']);

    useEffect(() => {
        if (cursor.selectedRecordIds.length === 1) {
            setSelectedRecordId(cursor.selectedRecordIds[0]);
        } else {
            setSelectedRecordId(null);
        }
    }, [cursor.selectedRecordIds]);

    const handleSelectRecord = () => {
        setIsChooserVisible(true);
    };

    if (!isButtonAction) {
        if (cursor.activeTableId !== tableToUpdate.id) {
            return (
                <div className="app-container">
                    <img alt="Logo" className="header-logo" src={`data:image/png;base64,${HiltonLogoBase64}`} />
                    <Header />
                    <div className="main-content">
                        <Text>Switch to the “{tableToUpdate.name}” table to use this app.</Text>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="app-container">
            <img alt="Logo" className="header-logo" src={`data:image/png;base64,${HiltonLogoBase64}`} />
            <Header />
            <div className="main-content">
                {!isChooserVisible && (selectedRecordId || isButtonAction) && (
                    <Button onClick={handleSelectRecord}>
                        Upload Files from Dropbox
                    </Button>
                )}
                {isChooserVisible && (selectedRecordId || isButtonAction) && (
                    <DropboxChooser tableToUpdate={tableToCreateRecords} recordId={selectedRecordId || recordActionData.recordId} setIsChooserVisible={setIsChooserVisible} />
                )}
                {!selectedRecordId && !isButtonAction && <Text>Select one record to update.</Text>}
            </div>
        </div>
    );
}

function DropboxChooser({ tableToUpdate, recordId, setIsChooserVisible }) {
    const globalConfig = useGlobalConfig();
    const fieldToUpdateLinks = globalConfig.get('selectedAssetLinkFieldId') as string;
    const fieldToUpdateField = globalConfig.get('selectedAssetFileFieldId') as string;
    const fieldToUpdateName = globalConfig.get('selectedAssetNameFieldId') as string;
    const fieldToUpdateLinkedField = globalConfig.get('selectedAssetLinkedFieldId') as string;
    useEffect(() => {
        const options = {
            success: function (files) {
                uploadFilesToAirtable(tableToUpdate, recordId, files,fieldToUpdateLinks,fieldToUpdateField,fieldToUpdateName,fieldToUpdateLinkedField);
                setIsChooserVisible(false);
            },
            cancel: function () {
                setIsChooserVisible(false);
            },
            linkType: 'preview',
            multiselect: true,
            folderselect: false,
        };
        //@ts-ignore
        window.Dropbox.choose(options);
    }, []);

    return null;
}

async function uploadFilesToAirtable(table, recordId, files,fieldToUpdateLinks,fieldToUpdateField,fieldToUpdateName,fieldToUpdateLinkedField) {
    try {
        await table.createRecordsAsync(files.map(file => {return{
            fields:{
                [fieldToUpdateName]: file.name,
                [fieldToUpdateField]: [{ url: file.link.replace('www.dropbox.com', 'dl.dropboxusercontent.com'), filename: file.name }],
                [fieldToUpdateLinks]: file.link,
                [fieldToUpdateLinkedField]: [{id:recordId}]
            }
        }}))
    } catch (error) {
        console.error('Error updating record:', error);
    }
}

export default UpdateRecords;
