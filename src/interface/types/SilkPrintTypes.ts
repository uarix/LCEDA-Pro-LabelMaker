export interface SilkPrintPreset {
	id: string;
	name: string;
	leftStructure: string;
	rightStructure: string;
	text: {
		content: string;
		fontSize: number;
		fontFamily: string;
		alignment: 'left' | 'center' | 'right';
	};
}
