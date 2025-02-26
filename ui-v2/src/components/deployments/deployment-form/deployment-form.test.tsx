import { WorkPool } from "@/api/work-pools";
import { WorkQueue } from "@/api/work-queues";
import { Toaster } from "@/components/ui/toaster";
import {
	createFakeDeployment,
	createFakeWorkPool,
	createFakeWorkQueue,
} from "@/mocks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { buildApiUrl, createWrapper } from "@tests/utils";
import { mockPointerEvents } from "@tests/utils/browser";
import { http, HttpResponse } from "msw";
import { beforeAll, describe, expect, it } from "vitest";
import { DeploymentForm } from "./deployment-form";

describe("DeploymentForm", () => {
	beforeAll(mockPointerEvents);

	const mockWorkPoolsAPI = (workPools: Array<WorkPool>) => {
		http.post(buildApiUrl("/work_pools/filter"), () => {
			return HttpResponse.json(workPools);
		});
	};

	const mockWorkPoolWorkQueuesAPI = (workQueues: Array<WorkQueue>) => {
		http.post(buildApiUrl("/work_pools/:work_pool_name/queues/filter"), () => {
			return HttpResponse.json(workQueues);
		});
	};

	it("is able to update a deployment", async () => {
		// ------------ Setup
		const user = userEvent.setup();
		const mockDeployment = createFakeDeployment();
		const mockWorkPools = [createFakeWorkPool({ name: "my-work-pool" })];
		const mockWorkQueues = [
			createFakeWorkQueue({
				work_pool_name: "my-work-pool",
				name: "my-work-queue",
			}),
		];

		mockWorkPoolsAPI(mockWorkPools);
		mockWorkPoolWorkQueuesAPI(mockWorkQueues);

		render(
			<>
				<Toaster />
				<DeploymentForm deployment={mockDeployment} />
			</>,
			{ wrapper: createWrapper() },
		);

		// ------------ Act
		await user.click(screen.getByRole("combobox", { name: /select action/i }));
		await user.click(screen.getByRole("option", { name: "Cancel a flow run" }));
		await user.click(screen.getByRole("button", { name: /add action/i }));

		// ------------ Assert
		expect(screen.getAllByText("Cancel a flow run")).toBeTruthy();
		expect(screen.getByText(/action 1/i)).toBeVisible();
		expect(screen.getByText(/action 2/i)).toBeVisible();
	});
});
