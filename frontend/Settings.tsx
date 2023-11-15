import { base } from '@airtable/blocks';
import { FieldType } from '@airtable/blocks/models';
import { FieldPickerSynced, FormField, Input, TablePickerSynced, useGlobalConfig } from '@airtable/blocks/ui';
import React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import './Settings.scss';
import Header from './Header';

const Settings = () => {
    const globalConfig = useGlobalConfig();

    const tableId = globalConfig.get('selectedTableId') as string;

    const table = base.getTableByIdIfExists(tableId);

    return (
        <>
            <Header />
            <Tabs defaultActiveKey="configuration" className="configuration-tabs">
                <Tab eventKey="configuration" title="Configuration">
                    <Card className="configuration">
                        <FormField label="Table">
                            <TablePickerSynced globalConfigKey="selectedTableId" />
                        </FormField>
                        {table?.id ? <>
                        <FormField label="Asset Field" marginBottom={0}>
                            <FieldPickerSynced
                                table={table}
                                globalConfigKey="selectedAssetFieldId"
                                placeholder="Pick the attachment field for your assets"
                                allowedTypes={[FieldType.MULTIPLE_ATTACHMENTS]}
                            />
                        </FormField>
                        <FormField label="Asset Links Field" marginBottom={0}>
                            <FieldPickerSynced
                                table={table}
                                globalConfigKey="selectedAssetLinkFieldId"
                                placeholder="Pick the attachment field for your asset links"
                                allowedTypes={[FieldType.MULTILINE_TEXT, FieldType.SINGLE_LINE_TEXT, FieldType.URL]}
                            />
                        </FormField>
                        <FormField label="Dropbox API Key" marginBottom={0}>
                            <Input
                                type="password"
                                value={globalConfig.get('apiKey') as string}
                                onChange={event => globalConfig.setAsync('apiKey', event.target.value)}
                            />
                        </FormField>
                        </> : null}
                    </Card>
                </Tab>
                <Tab eventKey="about" title="About">
                    <Card className="configuration">
                        <p>An extension to choose files from Dropbox.</p>
                    </Card>
                </Tab>
                <Tab eventKey="license" title="License">
                    <Card className="configuration">
                        &copy; {new Date().getFullYear()} InAir Studio
                    </Card>
                </Tab>
            </Tabs>
        </>
    )
}

export default Settings;