import { context, trace, Span, SpanStatusCode } from "@opentelemetry/api";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { Resource } from "@opentelemetry/resources";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ZoneContextManager } from "@opentelemetry/context-zone";

const serviceName = "i-dair-frontend";

const resource = new Resource({ "service.name": serviceName });
const provider = new WebTracerProvider({ resource });

const collector = new OTLPTraceExporter({
  url: `${process.env.REACT_APP_HOST_SIGNOZ}/v1/traces`,
});

provider.addSpanProcessor(new SimpleSpanProcessor(collector));
provider.register({ contextManager: new ZoneContextManager() });

const webTracerWithZone = provider.getTracer(serviceName);

export async function traceSpan<F extends (...args: any) => ReturnType<F>>(
  name: string,
  func: F
): Promise<ReturnType<F>> {
  let singleSpan: Span | undefined;
  let bindingSpan: Span | undefined;
  if (bindingSpan) {
    const ctx = trace.setSpan(context.active(), bindingSpan);
    singleSpan = webTracerWithZone.startSpan(name, undefined, ctx);
    bindingSpan = undefined;
  } else {
    singleSpan = webTracerWithZone.startSpan(name);
  }
  try {
    const result = await func(
      singleSpan.spanContext().traceId,
      singleSpan.spanContext().spanId
    );
    // Wait for the function to complete
    singleSpan.end();
    return result;
  } catch (error) {
    singleSpan?.setStatus({ code: SpanStatusCode.ERROR });
    singleSpan?.end();
    console.error(`Error in span: ${name}`, error);
    throw error;
  }
}
