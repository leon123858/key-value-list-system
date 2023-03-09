import grpc, { loadPackageDefinition } from '@grpc/grpc-js';
import { load } from '@grpc/proto-loader';

export async function loadProto(filePath: string) {
	const packageDefinition = await load(filePath, {
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	});
	const protoDescriptor = loadPackageDefinition(packageDefinition);
	return protoDescriptor.postList as grpc.GrpcObject;
}
