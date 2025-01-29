<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import '../app.css';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	onMount(async () => {
		// ensure bucket is created
		if ((await fetch('/buckets/resources')).status === 404) {
			await fetch('/buckets/resources', { method: 'PUT' });
		}
	});
</script>

{@render children()}
