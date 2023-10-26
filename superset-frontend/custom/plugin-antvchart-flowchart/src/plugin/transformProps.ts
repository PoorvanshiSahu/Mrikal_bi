/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ChartProps, TimeseriesDataRecord } from '@superset-ui/core';
// import { getOriginalSeries } from '@superset-ui/chart-controls';

export default function transformProps(chartProps: ChartProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your SupersetPluginAntGraphFlowChart.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queriesData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queriesData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const { width, height, formData, queriesData } = chartProps;
  const {
    boldText,
    headerFontSize,
    headerText,
    sourceId,
    targetId,
    nodeLabel,
    edgeLabel,
    metrics,
    edgeMetric,
    color,
    nodeStrength,
    edgeStrength,
    textColor,
  } = formData;

  console.log('formData', formData);
  console.log(width, height, 'width');
  const rawData = (queriesData[0].data as TimeseriesDataRecord[]) || [];

  let edgeMax = Number.MIN_SAFE_INTEGER;
  const edgeMin = 0;

  let nodeMax = Number.MIN_SAFE_INTEGER;
  const nodeMin = 0;

  function createNode(rawData: any): any {
    const s = new Set();
    const mapLabel = new Map();
    const mapMetric = new Map();
    for (let i = 0; i < rawData.length; i += 1) {
      s.add(rawData[i][sourceId]);
      s.add(rawData[i][targetId]);
      if (nodeLabel !== undefined) {
        mapLabel.set(rawData[i][sourceId], rawData[i][nodeLabel]);
      } else if (nodeLabel === undefined) {
        mapLabel.set(rawData[i][sourceId], rawData[i][sourceId]);
      }

      if (metrics.length > 0) {
        if (nodeMax < rawData[i][metrics[0].label]) {
          nodeMax = rawData[i][metrics[0].label];
        }
        mapMetric.set(rawData[i][sourceId], rawData[i][metrics[0].label]);
      }
    }

    const nodes: any = [];
    // var id = 1;
    for (const item of s) {
      let subLabel = '';
      if (mapLabel.get(item) !== undefined) {
        subLabel = mapLabel.get(item);
      }
      let metricStr = 10;
      if (mapMetric.get(item) !== undefined) {
        metricStr = parseInt(mapMetric.get(item), 10);
      }

      // const dummyObj = {
      //   id:item,
      //   parentId: '',
      //   renderKey: 'Terminal',
      //   name: subLabel,
      //   label: item,
      //   width: 100,
      //   height: 40,
      //   ports: {
      //     items: [
      //       { group: 'top', id: '3c0f5d34-3ab9-40a6-bfd8-bfe736fd8b59' },
      //       { group: 'right', id: '1911685f-a894-4e63-ace4-db386ae97bad' },
      //       { group: 'bottom', id: '25aed5b5-ad0e-4638-8775-de00294097f1' },
      //       { group: 'left', id: '9989c947-1b39-4635-b9aa-bb5e6ad9351e' },
      //     ],
      //     groups: {
      //       top: {
      //         position: { name: 'top' },
      //         attrs: {
      //           circle: {
      //             r: 4,
      //             magnet: true,
      //             stroke: '#31d0c6',
      //             strokeWidth: 2,
      //             fill: '#fff',
      //             style: { visibility: 'hidden' },
      //           },
      //         },
      //         zIndex: 10,
      //       },
      //       right: {
      //         position: { name: 'right' },
      //         attrs: {
      //           circle: {
      //             r: 4,
      //             magnet: true,
      //             stroke: '#31d0c6',
      //             strokeWidth: 2,
      //             fill: '#fff',
      //             style: { visibility: 'hidden' },
      //           },
      //         },
      //         zIndex: 10,
      //       },
      //       bottom: {
      //         position: { name: 'bottom' },
      //         attrs: {
      //           circle: {
      //             r: 4,
      //             magnet: true,
      //             stroke: '#31d0c6',
      //             strokeWidth: 2,
      //             fill: '#fff',
      //             style: { visibility: 'hidden' },
      //           },
      //         },
      //         zIndex: 10,
      //       },
      //       left: {
      //         position: { name: 'left' },
      //         attrs: {
      //           circle: {
      //             r: 4,
      //             magnet: true,
      //             stroke: '#31d0c6',
      //             strokeWidth: 2,
      //             fill: '#fff',
      //             style: { visibility: 'hidden' },
      //           },
      //         },
      //         zIndex: 10,
      //       },
      //     },
      //   },
      //   isLeaf: true,
      //   x: 350,
      //   y: 80,
      //   zIndex: 10,
      //   stroke: '#417505',

      //   value: {
      //     text: item,
      //     subText: subLabel,
      //     metric: metricStr,
      //   },
      // };

      const dummyObj = {
        id: item,
        value: {
          text: item,
          subText: subLabel,
          metric: metricStr,
        },
      };
      id += 1;
      nodes.push(dummyObj);
    }

    return nodes;
  }

  function findIndex(nodes: any, source: any, target: any): any {
    const result = new Array(2);

    for (const node of nodes) {
      if (node.value.text === source) {
        result[0] = node;
      }
      if (node.value.text === target) {
        result[1] = node;
      }
    }

    return result;
  }

  function createEdge(rawData: any, nodes: any): any {
    const edges = new Set();

    for (let i = 0; i < rawData.length; i += 1) {
      const nds = findIndex(nodes, rawData[i][sourceId], rawData[i][targetId]);

      // const dummyObj= {
      //   id: '[object Object]:25aed5b5-ad0e-4638-8775-de00294097f1-[object Object]:7643ce5d-4e4c-4776-affd-6f2ca0335dcc',
      //   targetPortId: nds[1].id,
      //   sourcePortId: nds[0].id,
      //   source: { cell: 'node-63cd90e9-090b-4a52-b003-084fe8512d37', port: '25aed5b5-ad0e-4638-8775-de00294097f1' },
      //   target: { cell: 'node-915545b7-7723-4ccc-8970-3309da79a0d5', port: '7643ce5d-4e4c-4776-affd-6f2ca0335dcc' },
      //   zIndex: 1,
      //   attrs: {
      //     line: {
      //       stroke: '#A2B1C3',
      //       targetMarker: { name: '', width: 1, height: 1 },
      //       strokeDasharray: '7 7',
      //       strokeWidth: 1,
      //     },
      //   },
      //   data: {
      //     targetPortId: '7643ce5d-4e4c-4776-affd-6f2ca0335dcc',
      //     sourcePortId: '25aed5b5-ad0e-4638-8775-de00294097f1',
      //     source: 'node-63cd90e9-090b-4a52-b003-084fe8512d37',
      //     target: 'node-915545b7-7723-4ccc-8970-3309da79a0d5',
      //   },
      // },

      const dummyObj = {
        source: nds[0].id,
        target: nds[1].id,
        value: {},
      };
      const val: any = {
        metric: 1,
      };
      if (edgeLabel !== undefined) {
        val.text = rawData[i][edgeLabel];
      }

      if (edgeMetric.length > 0) {
        const v = rawData[i][edgeMetric[0].label];
        if (parseInt(v, 10) > edgeMax) {
          edgeMax = parseInt(v, 10);
        }
        val.metric = parseInt(v, 10);
      }
      dummyObj.value = val;
      edges.add(JSON.stringify(dummyObj));
    }

    return Array.from(edges, (edge: any) => JSON.parse(edge));
  }

  // console.log("set", createNode(rawData))
  // console.log("raw data ", rawData)
  const nodes: any = createNode(rawData) || [];
  const edges: any = createEdge(rawData, nodes) || [];
  const data = {
    nodes,
    edges,
  };

  console.log('formData via TransformProps.ts', formData);

  return {
    color,
    textColor,
    nodeStrength,
    edgeStrength,
    nodeMax,
    nodeMin,
    edgeMax,
    edgeMin,
    width,
    height,
    data,
    // and now your control data, manipulated as needed, and passed through as props!
    boldText,
    headerFontSize,
    headerText,
  };
}
