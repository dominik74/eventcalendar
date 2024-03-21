interface Props {
    setIsVisible: (arg0: boolean) => void;
}

export default function Settings({setIsVisible}: Props) {
    function close() {
    	setIsVisible(false);
    }

    return (
    	<div className="fixed w-full h-full top-0 left-0 bg-black bg-opacity-10
			flex align-center justify-center items-center">
		<div className="w-96 h-64 bg-white rounded shadow-xl p-2 mb-20">
			<div className="flex justify-between">
				<h1>settings</h1>
				<button onClick={close}>X</button>
			</div>
		</div>
	</div>
    );
}
