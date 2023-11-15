import React from "react";
import { useGlobalConfig, useSettingsButton } from "@airtable/blocks/ui";
import { useState } from "react";
import Settings from "./Settings";
import UpdateRecords from "./UpdateRecords";
import './App.scss';

const App = () => {
    const globalConfig = useGlobalConfig();
    const MAIN_TABLE_ID = globalConfig.get('selectedTableId');
    const ASSET_TABLE_ID = globalConfig.get('selectedTableAssetsId');
    const fieldToUpdateLinks = globalConfig.get('selectedAssetLinkFieldId');
    const fieldToUpdateAssets = globalConfig.get('selectedAssetFileFieldId');
    const fieldToUpdateName = globalConfig.get('selectedAssetNameFieldId');
    const fieldToUpdateLinkedField = globalConfig.get('selectedAssetLinkedFieldId');
    const API_KEY = globalConfig.get('apiKey');

    const isAllSet = MAIN_TABLE_ID && ASSET_TABLE_ID && fieldToUpdateLinks && fieldToUpdateAssets && fieldToUpdateName && fieldToUpdateLinkedField && API_KEY;

    // Show settings button
    const [isShowingSettings, setIsShowingSettings] = useState(false);
    useSettingsButton(function () {
        setIsShowingSettings(!isShowingSettings);
    });

    if (!isShowingSettings && !isAllSet) {
        setIsShowingSettings(true);
    }

    return (
        <div className="container-fluid">
            {isShowingSettings ? <Settings /> : <UpdateRecords />}
        </div>
    );
}

export default App;
