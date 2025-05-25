<!DOCTYPE html>
<html>
<body>

<h1 align="center">🌌 Meridian 🌌</h1>

<p>
  <b>
A React-based tool for quickly finding astronomical objects based on your location, preferred hours, and observation angle. The app utilizes the Wimmer Table, which consists of 126 objects ideal for small aperture telescopes and binoculars. It is designed to help users locate these objects within a specified observation window and at a desired angle above the horizon. The app addresses the often lengthy and challenging process of quickly finding satisfying objects for observation.</b>
</p>

---

## 🌟 Ongoing development

- **User Location Integration**: Automatically detects your location or lets you manually input a city name or choose place on map.
- **Observation Preferences**: Specify the hours that suit your observation plans.

## 🚀 Technologies Used

- **Frontend**: React with Material-UI for an intuitive and modern interface.
- **Location and Map Services**: Integrates MapTiler API to fetch user location and show map
- **astronomy-engine**: Used for astronomy calculations

## 📖 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/meridian.git
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Vite server:
   ```bash
   npm run dev
   ```

## 🪐 Future Improvements

- **Astronomical Object Listing**: List astronomical objects based on selected filters
- **Time Graph Visualization**: Displays available objects on a time graph, providing a more intuitive way to view results
- **Advanced finder**: By default, the app suggests Wimmer Table objects, but advanced users can explore millions of other astronomical objects
- **User profiles**: Users can create accounts to save favorite objects, track observed ones, and add observation notes
</body>
</html>
