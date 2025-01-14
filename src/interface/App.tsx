import extensionConfig from '@extensionConfig';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { ActionPanel } from './components/ActionPanel';
import { EdaInfo } from './components/EdaInfo';

type StatusType = 'success' | 'error' | 'info';

interface Status {
	message: string;
	type: StatusType;
}

function App() {
	const [status, setStatus] = useState<Status | null>(null);

	useEffect(() => {
		try {
			setStatus({
				message: 'Successfully connected to EDA',
				type: 'success',
			});
		} catch (error) {
			setStatus({
				message: 'Failed to connect to EDA: ' + (error as Error).message,
				type: 'error',
			});
		}
	}, []);

	const handleAction = async (action: string) => {
		try {
			switch (action) {
				case 'getVersion':
					setStatus({
						message: `Ext Version: ${extensionConfig.version}`,
						type: 'success',
					});
					break;
				case 'getAbout':
					setStatus({
						message: `Ext About: ${eda.sys_I18n.text('About Content')}`,
						type: 'success',
					});
					eda.sys_Dialog.showInformationMessage(
						`${eda.sys_I18n.text('About Version', undefined, undefined, extensionConfig.version)}
						\n
						${eda.sys_I18n.text('About Content')}`,
						eda.sys_I18n.text('About'),
					);
					break;
				case 'exit':
					setStatus({
						message: (await eda.sys_IFrame.closeIFrame('label_maker_' + extensionConfig.uuid)) ? 'Exit successful' : 'Exit failed',
						type: 'error',
					});
					break;
				default:
					setStatus({
						message: `Unknown action: ${action}`,
						type: 'error',
					});
			}
		} catch (error) {
			setStatus({
				message: `Error executing ${action}: ${(error as Error).message}`,
				type: 'error',
			});
		}
	};

	const StatusIcon = {
		success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
		error: <AlertCircle className="w-5 h-5 text-red-500" />,
		info: <Info className="w-5 h-5 text-blue-500" />,
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
				<header className="text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">EDA Plugin Test Interface</h1>
					<div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
				</header>

				<EdaInfo version={extensionConfig.version} />

				<ActionPanel onAction={handleAction} />

				{status && (
					<div
						className={`
            flex items-center gap-3 p-4 rounded-lg shadow-sm
            ${
				status.type === 'success'
					? 'bg-green-50 border border-green-200'
					: status.type === 'error'
						? 'bg-red-50 border border-red-200'
						: 'bg-blue-50 border border-blue-200'
			}
          `}
					>
						{StatusIcon[status.type]}
						<span
							className={`
              font-medium
              ${status.type === 'success' ? 'text-green-700' : status.type === 'error' ? 'text-red-700' : 'text-blue-700'}
            `}
						>
							{status.message}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
