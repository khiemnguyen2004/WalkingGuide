const { AppDataSource } = require("./data-source");

async function updateExistingSteps() {
  try {
    await AppDataSource.initialize();
    
    const tourStepRepo = AppDataSource.getRepository("TourStep");
    
    // Get all tour steps grouped by tour_id
    const allSteps = await tourStepRepo.find({
      order: {
        tour_id: "ASC",
        step_order: "ASC"
      }
    });
    
    console.log(`Found ${allSteps.length} total steps`);
    
    // Group steps by tour_id
    const stepsByTour = {};
    allSteps.forEach(step => {
      if (!stepsByTour[step.tour_id]) {
        stepsByTour[step.tour_id] = [];
      }
      stepsByTour[step.tour_id].push(step);
    });
    
    // Update each tour's steps with proper day values
    for (const tourId in stepsByTour) {
      const tourSteps = stepsByTour[tourId];
      const stepsPerDay = 2; // 2 places per day
      
      console.log(`Processing tour ${tourId} with ${tourSteps.length} steps`);
      
      for (let i = 0; i < tourSteps.length; i++) {
        const step = tourSteps[i];
        const day = Math.floor(i / stepsPerDay) + 1;
        
        await tourStepRepo.update(step.id, { day: day });
        console.log(`Updated step ${step.id} (order ${step.step_order}) to day ${day}`);
      }
    }
    
    console.log('Successfully updated all steps with proper day values');
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error updating steps:', error);
  }
}

updateExistingSteps();