import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const LIMIT_COLLISSION_STRATEGIES = {
	ENQUEUE: "ENQUEUE",
	CANCEL_NEW: "CANCEL_NEW",
};

type LimitCollissionStrategy = keyof typeof LIMIT_COLLISSION_STRATEGIES;

type LimitCollissionStrategySelectProps = {
	onValueChange: (value: LimitCollissionStrategy) => void;
	value: LimitCollissionStrategy | undefined;
};

export const LimitCollissionStrategySelect = ({
	onValueChange,
	value,
}: LimitCollissionStrategySelectProps) => {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger>
				<SelectValue placeholder={LIMIT_COLLISSION_STRATEGIES.ENQUEUE} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value={LIMIT_COLLISSION_STRATEGIES.ENQUEUE}>
						{LIMIT_COLLISSION_STRATEGIES.ENQUEUE}
					</SelectItem>
					<SelectItem value={LIMIT_COLLISSION_STRATEGIES.CANCEL_NEW}>
						{LIMIT_COLLISSION_STRATEGIES.CANCEL_NEW}
					</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
