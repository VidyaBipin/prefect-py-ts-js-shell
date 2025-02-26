import { Deployment } from "@/api/deployments";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	description: z.string().nullable().optional(),
	work_pool_name: z.string().nullable().optional(),
	work_queue_name: z.string().nullable().optional(),
	tags: z.array(z.string()).optional(),
	/** Coerce to solve common issue of transforming a string number to a number type */
	concurrency_limit: z
		.number()
		.or(z.string())
		.pipe(z.coerce.number())
		.nullable(),
	concurrency_options: z
		.object({
			collision_strategy: z.literal("ENQUEUE").or(z.literal("CANCEL_NEW")),
		})
		.nullable(),

	enforce_parameter_schema: z.boolean(),
	job_variables: z.string().superRefine((val, ctx) => {
		try {
			return JSON.parse(val) as Record<string, unknown>;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			ctx.addIssue({ code: "custom", message: "Invalid JSON" });
			return z.NEVER;
		}
	}),
});
export type DeploymentFormSchema = z.infer<typeof formSchema>;

export const useDeploymentForm = (deployment: Deployment) => {
	const form = useForm({
		resolver: zodResolver(formSchema),
	});

	// syncs form state to deployment to update
	useEffect(() => {
		const {
			description,
			work_pool_name,
			work_queue_name,
			tags,
			concurrency_limit,
			concurrency_options,
			enforce_parameter_schema,
			job_variables,
		} = deployment;

		form.reset({
			description,
			work_pool_name,
			work_queue_name,
			tags,
			concurrency_limit,
			concurrency_options,
			enforce_parameter_schema,
			job_variables: job_variables ? JSON.stringify(job_variables) : "",
		});
	}, [form, deployment]);

	return form;
};
