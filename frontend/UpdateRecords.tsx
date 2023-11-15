import { Text, Button, useBase, useCursor, useLoadable, useWatchable, useGlobalConfig } from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';
import HiltonLogoBase64 from './HiltonLogoBase64';
import Header from './Header';
import './UpdateRecords.scss';

function UpdateRecords() {
    const globalConfig = useGlobalConfig();
    const TABLE_ID = globalConfig.get('selectedTableId') as string;
    const ASSET_FIELD_ID = globalConfig.get('selectedAssetFieldId') as string;
    const base = useBase();
    const cursor = useCursor();
    const tableToUpdate = base.getTableByIdIfExists(TABLE_ID);
    const fieldToUpdate = tableToUpdate?.getFieldById(ASSET_FIELD_ID);
    useLoadable(cursor);
    useWatchable(cursor, ['selectedRecordIds']);
    const [isChooserVisible, setIsChooserVisible] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

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

    if (cursor.activeTableId !== tableToUpdate?.id) {
        return (
            <div className="app-container">
            <img alt="Logo" className="header-logo" src={`data:image/png;base64,${HiltonLogoBase64}`}
            />
            <Header/>
            <div className="main-content">
                <Text>Switch to the “{tableToUpdate?.name}” table to use this app.</Text>
            </div>
        </div>
        );
    }

    return (
        <div className="app-container">
            <img alt="Logo" className="header-logo" src={`data:image/png;base64,${HiltonLogoBase64}`}
            />
            <Header/>
            <div className="main-content">
                {!isChooserVisible && selectedRecordId && (
                    <Button onClick={handleSelectRecord}>
                        {selectedRecordId ? 'Upload Files from Dropbox' : 'Select one record'}
                    </Button>
                )}
                {isChooserVisible && selectedRecordId && (
                    <DropboxChooser tableToUpdate={tableToUpdate} fieldToUpdate={fieldToUpdate} recordId={selectedRecordId} setIsChooserVisible={setIsChooserVisible} />
                )}
                {!selectedRecordId && <Text>Select one record to update.</Text>
                }
            </div>
        </div>
    );
}

function DropboxChooser({ tableToUpdate, fieldToUpdate, recordId, setIsChooserVisible }) {
    const globalConfig = useGlobalConfig();
    const ASSET_LINKS_FIELD_ID = globalConfig.get('selectedAssetLinkFieldId') as string;
    useEffect(() => {
        const options = {
            success: function (files) {
                uploadFilesToAirtable(tableToUpdate, fieldToUpdate, ASSET_LINKS_FIELD_ID, recordId, files);
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

async function uploadFilesToAirtable(table, fieldAttachments, fieldLinks, recordId, files) {
    try {
        const queryResult = await table.selectRecordsAsync({ recordIds: [recordId] });
        const record = queryResult.getRecordById(recordId);
        const existingAttachments = record.getCellValue(fieldAttachments);
        const existingURLs = record.getCellValue(fieldLinks);
        const allAttachments = existingAttachments ? existingAttachments.concat(files.map(file => ({ url: file.link.replace('www.dropbox.com', 'dl.dropboxusercontent.com'), filename: file.name }))): files.map(file => ({ url: file.link.replace('www.dropbox.com', 'dl.dropboxusercontent.com'), filename: file.name }));
        const downloadLinks = existingURLs !== '\n' ? existingURLs + files.map(file => `*${file.name}: ${file.link}\n`).join('\n') : files.map(file => `*${file.name}: ${file.link}\n`).join('\n');
        await table.updateRecordAsync(record, {
            [fieldAttachments.id]: allAttachments,
            [fieldLinks]: downloadLinks + '\n',
        });
        console.log('Attachments:', allAttachments);
        console.log('Direct Download Links:', downloadLinks);
    } catch (error) {
        console.error('Error updating record:', error);
    }
}

export default UpdateRecords;