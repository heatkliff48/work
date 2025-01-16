# Manufacturing Execution System (MES)

## Overview

This MES application is designed to manage and monitor production processes in a manufacturing environment. It enables efficient tracking of production batches, resource allocation, and process optimization through intuitive interfaces and automated workflows.

## Features

1. **Batch Management**:

   - Track the status of production batches in real-time.
   - Allocate products to autoclaves based on density, quantity, and dimensions.
   - Handle product placement and movement dynamically.

2. **Resource Tracking**:

   - Monitor product quantities (`cakes_in_batch`, `cakes_residue`) during placement in autoclaves.
   - Optimize resource usage based on configurable thresholds (e.g., `MAX_QUANTITY`).

3. **Automated Calculations**:

   - Calculate product residues, quantities, and placement dynamically based on input data.
   - Real-time updates to production tables and autoclave states.

4. **User Interface**:

   - Interactive table views for production batches.
   - Grouped rows and real-time updates for enhanced clarity.
   - Buttons for user actions, such as product placement and batch updates.

5. **Redux Integration**:
   - Centralized state management for seamless communication between components.
   - Actions for unlocking buttons, updating batch states, and managing autoclave data.

## Technologies Used

- **React**: Front-end library for building the user interface.
- **Redux**: State management for maintaining global application state.
- **JavaScript**: Core programming language for application logic.
- **Contexts**: Context API for managing domain-specific state (e.g., `OrderContext`, `WarehouseContext`).

## Key Components

### 1. **ProductionBatchDesigner**

- Core component for managing and displaying production batches.
- Features:
  - Dynamic calculation of product attributes (`cakes_in_batch`, `cakes_residue`).
  - Real-time interaction with autoclave data.
  - Grouped and detailed views of production batches.

### 2. **Autoclave**

- Manages the state and visualization of autoclave resources.
- Features:
  - Dynamic assignment of products to autoclaves.
  - Tracking and visualization of autoclave utilization.
  - Action buttons for adding, deleting, and moving batches.

### 3. **Contexts and State Management**

- **WarehouseContext**: Handles inventory and product data.
- **OrderContext**: Manages order-specific workflows and autoclave state.
- **Redux Actions**:
  - `addBatchState`: Add new batch data.
  - `unlockButton`: Manage button states dynamically.
  - `updateBatchState`: Update batch details.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

## Usage

1. **Production Management**:

   - Access the `ProductionBatchDesigner` table to view and manage production batches.
   - Use the "Разместить" button to allocate products to autoclaves.

2. **Autoclave Operations**:

   - Navigate to the `Autoclave` section to view the placement of products.
   - Utilize action buttons for batch operations like deletion or movement.

3. **Real-Time Updates**:
   - Changes to product placement are reflected immediately in the user interface.

## Troubleshooting

### Excessive Rerenders

- Verify that state updates (`setProductonBatchDesigner`, `setAutoclave`) are conditional and avoid unnecessary triggers.

### Incorrect Calculations

- Add debugging logs around critical calculations (`cakes_in_batch`, `cakes_residue`) to validate logic.

## Contribution

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.
